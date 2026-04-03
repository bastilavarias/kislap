<?php

namespace App\Filament\Resources\ReservedSubDomains\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReservedSubDomainForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Reserved subdomain')
                    ->schema([
                        TextInput::make('sub_domain')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Select::make('type')
                            ->options([
                                'portfolio' => 'Portfolio',
                                'linktree' => 'Linktree',
                                'menu' => 'Menu',
                                'biz' => 'Biz',
                                'waitlist' => 'Waitlist',
                            ])
                            ->nullable(),
                    ])
                    ->columns(2),
            ]);
    }
}
