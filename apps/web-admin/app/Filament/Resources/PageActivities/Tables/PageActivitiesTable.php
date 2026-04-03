<?php

namespace App\Filament\Resources\PageActivities\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PageActivitiesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('type')
                    ->badge()
                    ->sortable(),
                TextColumn::make('page_url')
                    ->label('Page URL')
                    ->wrap()
                    ->searchable(),
                TextColumn::make('project.name')
                    ->label('Project')
                    ->toggleable(),
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(),
                TextColumn::make('model_name')
                    ->label('Model')
                    ->toggleable(),
                TextColumn::make('model_id')
                    ->label('Model ID')
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
