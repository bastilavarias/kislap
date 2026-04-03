<?php

namespace App\Filament\Resources\Showcases\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ShowcasesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('portfolio.name')
                    ->label('Portfolio')
                    ->toggleable(),
                TextColumn::make('placement_order')
                    ->label('Order')
                    ->sortable()
                    ->toggleable(),
                IconColumn::make('is_approved')
                    ->label('Approved')
                    ->boolean(),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_approved')
                    ->label('Approved'),
                TernaryFilter::make('is_featured')
                    ->label('Featured'),
                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Approve')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function ($record): void {
                        $record->update([
                            'is_approved' => true,
                            'approved_at' => now(),
                            'approved_by' => auth()->id(),
                        ]);
                    })
                    ->visible(fn ($record): bool => ! $record->is_approved)
                    ->disabled(fn (): bool => auth()->user()?->role === 'support'),
                Action::make('unapprove')
                    ->label('Unapprove')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(function ($record): void {
                        $record->update([
                            'is_approved' => false,
                            'approved_at' => null,
                            'approved_by' => null,
                        ]);
                    })
                    ->visible(fn ($record): bool => $record->is_approved)
                    ->disabled(fn (): bool => auth()->user()?->role === 'support'),
                Action::make('feature')
                    ->label('Feature')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['is_featured' => true]))
                    ->visible(fn ($record): bool => ! $record->is_featured)
                    ->disabled(fn (): bool => auth()->user()?->role === 'support'),
                Action::make('unfeature')
                    ->label('Unfeature')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['is_featured' => false]))
                    ->visible(fn ($record): bool => $record->is_featured)
                    ->disabled(fn (): bool => auth()->user()?->role === 'support'),
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
