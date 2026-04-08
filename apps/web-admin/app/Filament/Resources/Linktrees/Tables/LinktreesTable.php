<?php

namespace App\Filament\Resources\Linktrees\Tables;

use App\Models\Linktree;
use App\Support\HostedSiteUrl;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class LinktreesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.full_name')
                    ->label('Owner')
                    ->toggleable()
                    ->searchable(['users.first_name', 'users.last_name', 'users.email']),
                TextColumn::make('project.name')
                    ->label('Project')
                    ->toggleable(),
                TextColumn::make('layout_name')
                    ->label('Layout')
                    ->toggleable(),
                TextColumn::make('theme_name')
                    ->label('Theme')
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('visitSite')
                    ->label('Visit site')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn (Linktree $record): ?string => HostedSiteUrl::fromSubdomain($record->project?->sub_domain), shouldOpenInNewTab: true)
                    ->visible(fn (Linktree $record): bool => filled(HostedSiteUrl::fromSubdomain($record->project?->sub_domain))),
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
