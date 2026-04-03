<?php

namespace App\Filament\Resources\Portfolios\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class EducationRelationManager extends RelationManager
{
    protected static string $relationship = 'education';

    protected static ?string $recordTitleAttribute = 'school';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Education')
                    ->schema([
                        TextInput::make('school')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('level')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('degree')
                            ->maxLength(255),
                        TextInput::make('location')
                            ->maxLength(255),
                        TextInput::make('year_start')
                            ->maxLength(20),
                        TextInput::make('year_end')
                            ->maxLength(20),
                        Textarea::make('about')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('school')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('level')
                    ->toggleable(),
                TextColumn::make('year_start')
                    ->label('Start')
                    ->toggleable(),
                TextColumn::make('year_end')
                    ->label('End')
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->headerActions([
                CreateAction::make(),
            ]);
    }
}
