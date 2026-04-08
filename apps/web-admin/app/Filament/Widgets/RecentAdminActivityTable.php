<?php

namespace App\Filament\Widgets;

use App\Models\AdminAuditLog;
use Filament\Tables\Columns\TextColumn;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class RecentAdminActivityTable extends TableWidget
{
    protected static ?string $heading = 'Recent admin activity';

    protected int|string|array $columnSpan = 'full';

    public function getTableQuery(): Builder
    {
        return AdminAuditLog::query()
            ->with('user')
            ->latest('created_at')
            ->limit(8);
    }

    public function getTableColumns(): array
    {
        return [
            TextColumn::make('created_at')
                ->label('When')
                ->since()
                ->sortable(),
            TextColumn::make('user.full_name')
                ->label('Admin')
                ->placeholder('-'),
            TextColumn::make('action')
                ->badge()
                ->searchable(),
            TextColumn::make('target_type')
                ->label('Target')
                ->formatStateUsing(fn (?string $state): string => $state ? class_basename($state) : '-'),
            TextColumn::make('ip_address')
                ->label('IP')
                ->toggleable(),
        ];
    }
}
