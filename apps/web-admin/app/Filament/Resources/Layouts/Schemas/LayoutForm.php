<?php

namespace App\Filament\Resources\Layouts\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LayoutForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Layout')
                    ->schema([
                        Select::make('type')
                            ->options([
                                'portfolio' => 'Portfolio',
                                'links' => 'Linktree',
                                'menu' => 'Menu',
                                'biz' => 'Biz',
                                'waitlist' => 'Waitlist',
                            ])
                            ->required(),
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('image_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
