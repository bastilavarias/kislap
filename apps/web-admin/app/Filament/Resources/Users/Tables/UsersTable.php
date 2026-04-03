<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('full_name')
                    ->label('Name')
                    ->searchable(['first_name', 'last_name'])
                    ->sortable(['first_name', 'last_name']),
                TextColumn::make('email')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('role')
                    ->badge()
                    ->sortable(),
                TextColumn::make('mobile_number')
                    ->searchable()
                    ->toggleable(),
                IconColumn::make('email_verified_at')
                    ->label('Verified')
                    ->boolean()
                    ->getStateUsing(fn ($record): bool => filled($record->email_verified_at)),
                IconColumn::make('newsletter')
                    ->boolean()
                    ->label('Newsletter'),
                IconColumn::make('is_banned')
                    ->boolean()
                    ->label('Banned'),
                TextColumn::make('banned_at')
                    ->label('Banned At')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('projects_count')
                    ->counts('projects')
                    ->label('Projects')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('role')
                    ->options([
                        'default' => 'Default',
                        'admin' => 'Admin',
                        'super_admin' => 'Super Admin',
                        'support' => 'Support',
                    ]),
                TernaryFilter::make('newsletter'),
                TernaryFilter::make('is_banned')
                    ->label('Banned'),
                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('ban')
                    ->label('Ban')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->form([
                        Textarea::make('ban_reason')
                            ->label('Reason')
                            ->rows(3)
                            ->required(),
                    ])
                    ->action(function ($record, array $data): void {
                        $record->update([
                            'is_banned' => true,
                            'banned_at' => now(),
                            'ban_reason' => $data['ban_reason'],
                            'banned_by' => auth()->id(),
                        ]);
                    })
                    ->visible(fn ($record): bool => ! $record->is_banned && auth()->user()?->role !== 'support')
                    ->disabled(fn ($record): bool => in_array($record->role, ['admin', 'super_admin'], true)),
                Action::make('unban')
                    ->label('Unban')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function ($record): void {
                        $record->update([
                            'is_banned' => false,
                            'banned_at' => null,
                            'ban_reason' => null,
                            'banned_by' => null,
                        ]);
                    })
                    ->visible(fn ($record): bool => $record->is_banned && auth()->user()?->role !== 'support'),
                EditAction::make()
                    ->visible(fn (): bool => auth()->user()?->role !== 'support'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ])->visible(fn (): bool => auth()->user()?->role !== 'support'),
            ]);
    }
}
