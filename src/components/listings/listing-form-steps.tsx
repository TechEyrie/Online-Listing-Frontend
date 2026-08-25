'use client';

import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';

import { CategoryDropdown } from '@/components/categories/category-dropdown';
import { ListingAttributeFields } from '@/components/listings/listing-attribute-fields';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CITIES_BY_COUNTRY,
  LISTING_COUNTRIES,
  LISTING_CURRENCIES,
} from '@/lib/location-currency';
import type { ListingFormValues } from '@/lib/listing-validators';
import type { CategoryAttribute, CategoryTreeNode } from '@/types/category';
import type { Listing } from '@/types/listing';

interface SharedProps {
  register: UseFormRegister<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
}

export function ListingDetailsStep({ register, errors }: SharedProps) {
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
                {code}
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
}: CategoryStepProps) {
  const country = watch('country');
  const citySuggestions = CITIES_BY_COUNTRY[country] ?? [];

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
          <Input
            id="country"
            list="listing-countries"
            placeholder="e.g. Qatar"
            {...register('country')}
          />
          <datalist id="listing-countries">
            {LISTING_COUNTRIES.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State / Region</Label>
          <Input
            id="state"
            placeholder="Optional — any state or municipality"
            {...register('state')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            list="listing-cities"
            placeholder="Any city worldwide"
            {...register('city')}
          />
          <datalist id="listing-cities">
            {citySuggestions.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Choose any country, optional state/region, and any city. Suggestions appear for common
        markets (Qatar first).
      </p>
    </div>
  );
}

interface AttributesStepProps {
  attributes: CategoryAttribute[];
  attrValues: Record<string, string>;
  onAttrChange: (name: string, value: string) => void;
  onFilesChange: (files: File[]) => void;
  fileCount: number;
  mode: 'create' | 'edit';
  existingImageCount?: number;
}

export function ListingAttributesStep({
  attributes,
  attrValues,
  onAttrChange,
  onFilesChange,
  fileCount,
  mode,
  existingImageCount = 0,
}: AttributesStepProps) {
  return (
    <div className="space-y-4">
      <ListingAttributeFields attributes={attributes} values={attrValues} onChange={onAttrChange} />
      <div className="space-y-2">
        <Label htmlFor="images">Images (up to 10)</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onFilesChange(Array.from(e.target.files ?? []).slice(0, 10))}
        />
        {fileCount > 0 && (
          <p className="text-xs text-muted-foreground">{fileCount} file(s) selected</p>
        )}
        {mode === 'edit' && existingImageCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Existing images: {existingImageCount} (new uploads are appended)
          </p>
        )}
      </div>
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
