<?php

namespace App\Filament\Widgets;

use App\Models\Project;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class RecentProjects extends TableWidget
{
    protected int|string|array $columnSpan = 'full';

    public function getTableQuery(): Builder
    {
        return Project::query()
            ->latest('updated_at')
            ->limit(8);
    }

    public function getTableColumns(): array
    {
        return [
            TextColumn::make('name')
                ->searchable()
                ->sortable(),
            TextColumn::make('type')
                ->badge(),
            TextColumn::make('user.full_name')
                ->label('Owner')
                ->toggleable(),
            IconColumn::make('published')
                ->boolean(),
            TextColumn::make('updated_at')
                ->dateTime()
                ->sortable(),
        ];
    }
}
