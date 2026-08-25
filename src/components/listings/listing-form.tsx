'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import {
  ListingAttributesStep,
  ListingCategoryStep,
  ListingDetailsStep,
  ListingPreviewStep,
} from '@/components/listings/listing-form-steps';
import { findNode, findRootFor } from '@/components/listings/listing-form-utils';
import { Button } from '@/components/ui/button';
import { useCategoryTree } from '@/hooks/use-categories';
import { listingApi } from '@/lib/listing-api';
import { DEFAULT_LISTING_CURRENCY } from '@/lib/location-currency';
import { listingFormSchema, type ListingFormValues } from '@/lib/listing-validators';
import type { ApiErrorResponse } from '@/types/api';
import type { CategoryAttribute } from '@/types/category';
import type { Listing } from '@/types/listing';

interface ListingFormProps {
  mode: 'create' | 'edit';
  listing?: Listing;
}

export function ListingForm({ mode, listing }: ListingFormProps) {
  const router = useRouter();
  const { data: tree = [] } = useCategoryTree();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [attrValues, setAttrValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (listing?.attributes) {
      for (const [key, value] of Object.entries(listing.attributes)) {
        initial[key] = String(value);
      }
    }
    return initial;
  });
  const [serverError, setServerError] = useState<string | null>(null);

  const categoryId =
    typeof listing?.category === 'object' ? listing.category._id : (listing?.category ?? '');
  const subcategoryId =
    typeof listing?.subcategory === 'object'
      ? listing.subcategory._id
      : (listing?.subcategory ?? '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: listing?.title ?? '',
      description: listing?.description ?? '',
      price: listing?.price ?? 0,
      currency: (listing?.currency as ListingFormValues['currency']) ?? DEFAULT_LISTING_CURRENCY,
      priceType: listing?.priceType ?? 'negotiable',
      type: listing?.type ?? 'sale',
      category: categoryId,
      subcategory: subcategoryId,
      condition: listing?.condition,
      city: listing?.location?.city ?? '',
      state: listing?.location?.state ?? '',
      country: listing?.location?.country ?? 'Qatar',
    },
  });

  const selectedCategoryId = watch('category');
  const selectedSubcategoryId = watch('subcategory');
  const selectedRoot = useMemo(
    () => (selectedCategoryId ? findRootFor(tree, selectedCategoryId) : null),
    [tree, selectedCategoryId],
  );
  const selectedLeaf = useMemo(() => {
    if (selectedSubcategoryId) return findNode(tree, selectedSubcategoryId);
    if (selectedCategoryId) return findNode(tree, selectedCategoryId);
    return null;
  }, [tree, selectedCategoryId, selectedSubcategoryId]);
  const dynamicAttributes: CategoryAttribute[] = selectedLeaf?.attributes ?? [];

  const onCategoryChange = (id: string) => {
    const root = findRootFor(tree, id);
    const node = findNode(tree, id);
    if (!root || !node) return;
    if (node.parent) {
      setValue('category', root._id);
      setValue('subcategory', node._id);
    } else {
      setValue('category', node._id);
      setValue('subcategory', '');
    }
    setAttrValues({});
  };

  const buildFormData = (values: ListingFormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', String(values.price));
    formData.append('currency', values.currency);
    formData.append('priceType', values.priceType);
    formData.append('type', values.type);
    formData.append('category', values.category);
    if (values.subcategory) formData.append('subcategory', values.subcategory);
    if (values.condition) formData.append('condition', values.condition);
    formData.append('location[city]', values.city);
    if (values.state) formData.append('location[state]', values.state);
    formData.append('location[country]', values.country);

    const attrs: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(attrValues)) {
      if (value === '') continue;
      const def = dynamicAttributes.find((a) => a.name === key);
      if (def?.type === 'number') attrs[key] = Number(value);
      else if (def?.type === 'boolean') attrs[key] = value === 'true';
      else attrs[key] = value;
    }
    formData.append('attributes', JSON.stringify(attrs));
    for (const file of files) formData.append('images', file);
    return formData;
  };

  const nextStep = async () => {
    const fieldsByStep: Array<(keyof ListingFormValues)[]> = [
      ['title', 'description', 'price', 'currency', 'priceType', 'type', 'condition'],
      ['category', 'city', 'country'],
      [],
      [],
    ];
    if (await trigger(fieldsByStep[step])) setStep((s) => Math.min(3, s + 1));
  };

  const onSubmit = async (values: ListingFormValues) => {
    setServerError(null);
    try {
      for (const attr of dynamicAttributes) {
        if (attr.required && !attrValues[attr.name]) {
          setServerError(`Attribute "${attr.name}" is required`);
          setStep(2);
          return;
        }
      }
      const formData = buildFormData(values);
      const res =
        mode === 'create'
          ? await listingApi.create(formData)
          : await listingApi.update(listing!._id, formData);
      router.push(`/listings/${res.data.slug}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setServerError(axiosError.response?.data?.message || 'Could not save listing');
    }
  };

  const steps = ['Details', 'Category & location', 'Attributes & images', 'Preview'];

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`inline-flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-semibold transition-colors ${
              step === index
                ? 'bg-primary text-primary-foreground shadow-soft'
                : step > index
                  ? 'bg-primary-soft text-primary'
                  : 'bg-muted text-muted-foreground'
            }`}
            onClick={() => setStep(index)}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-card/25 text-xs tabular-nums">
              {index + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      {step === 0 && <ListingDetailsStep register={register} errors={errors} />}
      {step === 1 && (
        <ListingCategoryStep
          register={register}
          errors={errors}
          tree={tree}
          selectedCategoryId={selectedCategoryId}
          selectedSubcategoryId={selectedSubcategoryId}
          selectedRootName={selectedRoot?.name}
          onCategoryChange={onCategoryChange}
          watch={watch}
        />
      )}
      {step === 2 && (
        <ListingAttributesStep
          attributes={dynamicAttributes}
          attrValues={attrValues}
          onAttrChange={(name, value) => setAttrValues((prev) => ({ ...prev, [name]: value }))}
          onFilesChange={setFiles}
          fileCount={files.length}
          mode={mode}
          existingImageCount={listing?.images.length}
        />
      )}
      {step === 3 && (
        <ListingPreviewStep watch={watch} fileCount={files.length} mode={mode} listing={listing} />
      )}

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex gap-2">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button type="button" onClick={() => void nextStep()}>
            Continue
          </Button>
        ) : (
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Publish listing' : 'Save changes'}
          </Button>
        )}
      </div>
    </form>
  );
}
