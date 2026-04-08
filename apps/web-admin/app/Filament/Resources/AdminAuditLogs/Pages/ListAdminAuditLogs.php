<?php

namespace App\Filament\Resources\AdminAuditLogs\Pages;

use App\Filament\Resources\AdminAuditLogs\AdminAuditLogResource;
use Filament\Resources\Pages\ListRecords;

class ListAdminAuditLogs extends ListRecords
{
    protected static string $resource = AdminAuditLogResource::class;
}
