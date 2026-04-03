<?php

namespace App\Filament\Resources\ParsedFiles\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ParsedFilesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.full_name')
                    ->label('User')
                    ->toggleable(),
                TextColumn::make('project_type')
                    ->badge()
                    ->label('Project'),
                TextColumn::make('source_type')
                    ->badge(),
                TextColumn::make('source_name')
                    ->searchable()
                    ->wrap(),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
