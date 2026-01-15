<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReservedSubDomainsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $subdomains = [
            'www',
            'db',
            'npm',
            'portainer',
            'docs',
            'app',
            'builder',
            'admin',
            'api',
            'mail',
            'ftp',
            'cpanel',
            'webmail',
            'server',
            'public',
            'dev',
            'staging',
            'test'
        ];

        foreach ($subdomains as $subdomain) {
            $exists = DB::table('reserved_sub_domains')
                ->where('sub_domain', $subdomain)
                ->exists();

            if (! $exists) {
                DB::table('reserved_sub_domains')->insert([
                    'sub_domain' => $subdomain,
                    'type'       => 'system',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }
}
