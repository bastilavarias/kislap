<?php

namespace App\Filament\Resources\AdminAuditLogs\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AdminAuditLogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.full_name')
                    ->label('Admin')
                    ->toggleable(),
                TextColumn::make('action')
                    ->badge()
                    ->sortable(),
                TextColumn::make('target_type')
                    ->label('Target Type')
                    ->toggleable(),
                TextColumn::make('target_id')
                    ->label('Target ID')
                    ->toggleable(),
                TextColumn::make('targetUser.full_name')
                    ->label('Target User')
                    ->toggleable(),
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
