<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class LinktreeRelationManager extends RelationManager
{
    protected static string $relationship = 'linktree';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Linktree')
                    ->schema([
                        TextInput::make('name')
                            ->maxLength(255),
                        TextInput::make('tagline')
                            ->maxLength(255),
                        TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('phone')
                            ->maxLength(50),
                        TextInput::make('layout_name')
                            ->maxLength(100),
                        TextInput::make('theme_name')
                            ->maxLength(100),
                        TextInput::make('logo_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Select::make('background_style')
                            ->options([
                                'grid' => 'Grid',
                                'blur' => 'Blur',
                                'solid' => 'Solid',
                                'gradient' => 'Gradient',
                            ])
                            ->nullable(),
                        Textarea::make('about')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('tagline')
                    ->toggleable(),
                TextColumn::make('layout_name')
                    ->label('Layout')
                    ->toggleable(),
                TextColumn::make('theme_name')
                    ->label('Theme')
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
