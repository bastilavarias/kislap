<?php

namespace App\Filament\Resources\Projects\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ProjectsTable
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
                    ->searchable(['users.first_name', 'users.last_name', 'users.email'])
                    ->toggleable(),
                TextColumn::make('type')
                    ->badge()
                    ->sortable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('sub_domain')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                IconColumn::make('published')
                    ->boolean()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'portfolio' => 'Portfolio',
                        'linktree' => 'Linktree',
                        'menu' => 'Menu',
                        'biz' => 'Biz',
                        'waitlist' => 'Waitlist',
                    ]),
                TernaryFilter::make('published'),
                TrashedFilter::make(),
            ])
            ->recordActions([
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
