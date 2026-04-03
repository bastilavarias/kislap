<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Account')
                    ->schema([
                        TextInput::make('first_name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('last_name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        TextInput::make('mobile_number')
                            ->tel()
                            ->maxLength(20),
                        Select::make('role')
                            ->options([
                                'default' => 'Default',
                                'admin' => 'Admin',
                                'super_admin' => 'Super Admin',
                                'support' => 'Support',
                            ])
                            ->required()
                            ->default('default'),
                        TextInput::make('image_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        TextInput::make('password')
                            ->password()
                            ->revealable()
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn (?string $state): bool => filled($state))
                            ->maxLength(255)
                            ->confirmed(),
                        TextInput::make('password_confirmation')
                            ->password()
                            ->revealable()
                            ->dehydrated(false)
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->maxLength(255),
                    ])
                    ->columns(2),
                Section::make('Flags')
                    ->schema([
                        Toggle::make('newsletter'),
                        Toggle::make('github')
                            ->label('Signed in with GitHub'),
                        Toggle::make('google')
                            ->label('Signed in with Google'),
                    ])
                    ->columns(3),
            ]);
    }
}
