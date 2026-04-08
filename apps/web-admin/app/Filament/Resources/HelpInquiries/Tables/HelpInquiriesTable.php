<?php

namespace App\Filament\Resources\HelpInquiries\Tables;

use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class HelpInquiriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('mobile_number')
                    ->label('Mobile')
                    ->toggleable(),
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'new',
                        'primary' => 'in_progress',
                        'success' => 'resolved',
                        'danger' => 'spam',
                    ]),
                TextColumn::make('source_page')
                    ->label('Page')
                    ->toggleable()
                    ->wrap(),
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'new' => 'New',
                        'in_progress' => 'In progress',
                        'resolved' => 'Resolved',
                        'spam' => 'Spam',
                    ]),
            ])
            ->recordActions([
                Action::make('markInProgress')
                    ->label('Mark in progress')
                    ->color('primary')
                    ->action(fn ($record) => $record->update(['status' => 'in_progress']))
                    ->visible(fn ($record): bool => $record->status === 'new' && auth()->user()?->role !== 'support'),
                Action::make('resolve')
                    ->label('Resolve')
                    ->color('success')
                    ->action(fn ($record) => $record->update(['status' => 'resolved', 'resolved_at' => now()]))
                    ->visible(fn ($record): bool => $record->status !== 'resolved' && auth()->user()?->role !== 'support'),
                EditAction::make()
                    ->visible(fn (): bool => auth()->user()?->role !== 'support'),
            ]);
    }
}
