<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class AttentionByTypeChart extends BaseChartWidget
{
    protected static ?int $sort = 60;

    protected ?string $heading = 'Needs attention by project type';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $breakdown = app(AdminDashboardService::class)->attentionByType();

        return [
            'labels' => $breakdown['labels'],
            'datasets' => [
                [
                    'label' => 'Projects',
                    'data' => $breakdown['data'],
                    'backgroundColor' => [
                        '#111827',
                        '#2563eb',
                        '#f59e0b',
                        '#22c55e',
                        '#a855f7',
                    ],
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'polarArea';
    }
}
