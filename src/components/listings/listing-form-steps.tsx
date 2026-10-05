'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import { CategoryDropdown } from '@/components/categories/category-dropdown';
import { ListingAttributeFields } from '@/components/listings/listing-attribute-fields';
import { ListingImageUpload } from '@/components/listings/listing-image-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LISTING_CURRENCIES } from '@/lib/location-currency';
import {
  getCitiesForState,
  getStatesForCountry,
  isStructuredCountry,
  LISTING_COUNTRIES,
} from '@/lib/location-data';
import type { ListingFormValues } from '@/lib/listing-validators';
import type { CategoryAttribute, CategoryTreeNode } from '@/types/category';
import type { Listing } from '@/types/listing';

interface SharedProps {
  register: UseFormRegister<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
}

function useCurrencyLabels(): Record<string, string> {
  const [labels, setLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof Intl === 'undefined' || !('DisplayNames' in Intl)) return;
    const display = new Intl.DisplayNames(['en'], { type: 'currency' });
    const next: Record<string, string> = {};
    for (const code of LISTING_CURRENCIES) {
      const name = display.of(code);
      if (name) next[code] = name;
    }
    setLabels(next);
  }, []);

  return labels;
}

export function ListingDetailsStep({ register, errors }: SharedProps) {
  const currencyLabels = useCurrencyLabels();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" className="min-h-32" {...register('description')} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" {...register('price', { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select id="currency" {...register('currency')}>
            {LISTING_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {currencyLabels[code] ? `${code} — ${currencyLabels[code]}` : code}
              </option>
            ))}
          </Select>
          {errors.currency && <p className="text-sm text-destructive">{errors.currency.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceType">Price type</Label>
          <Select id="priceType" {...register('priceType')}>
            <option value="fixed">Fixed</option>
            <option value="negotiable">Negotiable</option>
            <option value="free">Free</option>
            <option value="contact">Contact</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select id="type" {...register('type')}>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
            <option value="service">Service</option>
            <option value="job">Job</option>
            <option value="wanted">Wanted</option>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Select id="condition" {...register('condition')}>
          <option value="">Not specified</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </Select>
      </div>
    </div>
  );
}

interface CategoryStepProps extends SharedProps {
  tree: CategoryTreeNode[];
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  selectedRootName?: string;
  onCategoryChange: (id: string) => void;
  watch: UseFormWatch<ListingFormValues>;
  setValue: UseFormSetValue<ListingFormValues>;
}

export function ListingCategoryStep({
  register,
  errors,
  tree,
  selectedCategoryId,
  selectedSubcategoryId,
  selectedRootName,
  onCategoryChange,
  watch,
  setValue,
}: CategoryStepProps) {
  const country = watch('country');
  const state = watch('state') ?? '';
  const city = watch('city') ?? '';
  const structured = isStructuredCountry(country);
  const states = useMemo(() => getStatesForCountry(country), [country]);
  const cities = useMemo(
    () => (state ? getCitiesForState(country, state) : []),
    [country, state],
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <CategoryDropdown
          tree={tree}
          value={selectedSubcategoryId || selectedCategoryId}
          onChange={onCategoryChange}
        />
        {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        {selectedRootName && (
          <p className="text-xs text-muted-foreground">Root: {selectedRootName}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            value={country}
            onChange={(e) => {
              setValue('country', e.target.value, { shouldValidate: true, shouldDirty: true });
              setValue('state', '');
              setValue('city', '');
            }}
          >
            {LISTING_COUNTRIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State / Region</Label>
          {structured ? (
            <Select
              id="state"
              value={state}
              onChange={(e) => {
                setValue('state', e.target.value, { shouldValidate: true, shouldDirty: true });
                setValue('city', '');
              }}
            >
              <option value="">Select state / region</option>
              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          ) : (
            <Input id="state" placeholder="State or region (optional)" {...register('state')} />
          )}
          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          {structured && cities.length > 0 ? (
            <Select
              id="city"
              value={city}
              disabled={!state}
              onChange={(e) =>
                setValue('city', e.target.value, { shouldValidate: true, shouldDirty: true })
              }
            >
              <option value="">{state ? 'Select city' : 'Select state first'}</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          ) : structured ? (
            <Input
              id="city"
              placeholder={state ? 'Enter city' : 'Select state first'}
              disabled={!state}
              {...register('city')}
            />
          ) : (
            <Input id="city" placeholder="City" {...register('city')} />
          )}
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Pick a country to load its states/regions, then choose a city. Use &quot;Other&quot; for
        free-text locations outside this list.
      </p>
    </div>
  );
}

interface AttributesStepProps {
  attributes: CategoryAttribute[];
  attrValues: Record<string, string>;
  onAttrChange: (name: string, value: string) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  mode: 'create' | 'edit';
  existingImageCount?: number;
}

export function ListingAttributesStep({
  attributes,
  attrValues,
  onAttrChange,
  files,
  onFilesChange,
  mode,
  existingImageCount = 0,
}: AttributesStepProps) {
  return (
    <div className="space-y-4">
      <ListingAttributeFields attributes={attributes} values={attrValues} onChange={onAttrChange} />
      <ListingImageUpload
        files={files}
        onFilesChange={onFilesChange}
        mode={mode}
        existingImageCount={existingImageCount}
      />
    </div>
  );
}

interface PreviewStepProps {
  watch: UseFormWatch<ListingFormValues>;
  fileCount: number;
  mode: 'create' | 'edit';
  listing?: Listing;
}

export function ListingPreviewStep({ watch, fileCount, mode, listing }: PreviewStepProps) {
  return (
    <div className="space-y-2 rounded-lg border p-4 text-sm">
      <p>
        <strong>Title:</strong> {watch('title')}
      </p>
      <p>
        <strong>Price:</strong> {watch('price')} {watch('currency')} ({watch('priceType')})
      </p>
      <p>
        <strong>Type:</strong> {watch('type')}
      </p>
      <p>
        <strong>Location:</strong> {watch('city')}
        {watch('state') ? `, ${watch('state')}` : ''}, {watch('country')}
      </p>
      <p>
        <strong>Images:</strong> {fileCount}
        {mode === 'edit' ? ` + ${listing?.images.length ?? 0} existing` : ''}
      </p>
      <p className="whitespace-pre-wrap text-muted-foreground">{watch('description')}</p>
    </div>
  );
}
