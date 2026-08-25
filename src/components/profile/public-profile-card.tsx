import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PublicProfile } from '@/types/user';

interface PublicProfileCardProps {
  profile: PublicProfile;
}

export function PublicProfileCard({ profile }: PublicProfileCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <CardTitle>{profile.name}</CardTitle>
          <CardDescription className="capitalize">{profile.role}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {profile.bio && <p>{profile.bio}</p>}
        {(profile.location?.city || profile.location?.country) && (
          <p className="text-muted-foreground">
            {[profile.location?.city, profile.location?.state, profile.location?.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}
        {profile.role === 'agent' && profile.agencyDetails?.name && (
          <p>
            <span className="text-muted-foreground">Agency:</span> {profile.agencyDetails.name}
          </p>
        )}
        {profile.role === 'brand' && profile.companyDetails?.name && (
          <p>
            <span className="text-muted-foreground">Company:</span> {profile.companyDetails.name}
          </p>
        )}
        {profile.socialLinks && (
          <div className="flex flex-wrap gap-3">
            {Object.entries(profile.socialLinks)
              .filter(([, url]) => Boolean(url))
              .map(([network, url]) => (
                <a
                  key={network}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize text-primary underline"
                >
                  {network}
                </a>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
