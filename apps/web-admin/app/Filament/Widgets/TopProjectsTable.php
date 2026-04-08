<?php

namespace App\Filament\Widgets;

use App\Models\Project;
use App\Support\AdminDashboardService;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class TopProjectsTable extends TableWidget
{
    protected static ?string $heading = 'Top projects by traffic';

    protected int|string|array $columnSpan = 'full';

    public function getTableQuery(): Builder
    {
        $ids = app(AdminDashboardService::class)->topProjectIds(8);

        if ($ids === []) {
            return Project::query()->whereRaw('1 = 0');
        }

        $orderedIds = implode(',', $ids);

        return Project::query()
            ->with('user')
            ->withCount([
                'pageActivities as views_count' => fn ($query) => $query->where('type', 'view'),
                'pageActivities as clicks_count' => fn ($query) => $query->where('type', 'click'),
            ])
            ->whereKey($ids)
            ->orderByRaw("FIELD(id, {$orderedIds})");
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
            TextColumn::make('views_count')
                ->label('Views')
                ->sortable(),
            TextColumn::make('clicks_count')
                ->label('Clicks')
                ->sortable(),
            TextColumn::make('ctr')
                ->label('CTR')
                ->getStateUsing(function (Project $record): string {
                    $views = (int) ($record->views_count ?? 0);
                    $clicks = (int) ($record->clicks_count ?? 0);

                    if ($views === 0) {
                        return '0%';
                    }

                    return number_format(($clicks / $views) * 100, 1) . '%';
                }),
            IconColumn::make('published')
                ->boolean(),
            TextColumn::make('updated_at')
                ->since(),
        ];
    }
}
