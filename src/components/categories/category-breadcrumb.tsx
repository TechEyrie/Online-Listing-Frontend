import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CategoryBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function CategoryBreadcrumb({ items }: CategoryBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            <span aria-hidden>/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
