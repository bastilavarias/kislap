<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Actions\ViewAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PageActivitiesRelationManager extends RelationManager
{
    protected static string $relationship = 'pageActivities';

    protected static ?string $recordTitleAttribute = 'page_url';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('type')
                    ->badge()
                    ->sortable(),
                TextColumn::make('page_url')
                    ->wrap()
                    ->limit(80),
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(),
                TextColumn::make('model_name')
                    ->label('Model')
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->headerActions([])
            ->bulkActions([]);
    }
}
