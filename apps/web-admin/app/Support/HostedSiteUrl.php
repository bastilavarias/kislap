<?php

namespace App\Support;

class HostedSiteUrl
{
    public static function fromSubdomain(?string $subdomain): ?string
    {
        $subdomain = filled($subdomain) ? trim((string) $subdomain) : null;

        if (! $subdomain) {
            return null;
        }

        $pattern = trim((string) config('app.site_url', 'https://*.kislap.app'));

        if ($pattern === '') {
            return null;
        }

        if (str_contains($pattern, '*')) {
            return str_replace('*', $subdomain, $pattern);
        }

        $parts = parse_url($pattern);

        if (! is_array($parts) || empty($parts['host'])) {
            return $pattern;
        }

        $scheme = $parts['scheme'] ?? 'https';
        $host = $parts['host'];
        $port = isset($parts['port']) ? ':' . $parts['port'] : '';
        $path = $parts['path'] ?? '';

        return "{$scheme}://{$subdomain}.{$host}{$port}{$path}";
    }
}
