<?php

return [
    'required' => 'O campo :attribute é obrigatório.',
    'required_with' => 'O campo :attribute é obrigatório quando :values for informado.',
    'required_unless' => 'O campo :attribute é obrigatório, exceto para vagas remotas.',
    'string' => 'O campo :attribute deve ser um texto.',
    'email' => 'Informe um e-mail válido.',
    'min' => [
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
        'numeric' => 'O campo :attribute deve ser de pelo menos :min.',
    ],
    'max' => [
        'string' => 'O campo :attribute não pode ter mais de :max caracteres.',
        'numeric' => 'O campo :attribute não pode ser maior que :max.',
    ],
    'size' => [
        'string' => 'O campo :attribute deve ter :size caracteres.',
    ],
    'numeric' => 'O campo :attribute deve ser um número.',
    'integer' => 'O campo :attribute deve ser um número inteiro.',
    'boolean' => 'O campo :attribute é inválido.',
    'date' => 'O campo :attribute deve ser uma data válida.',
    'before_or_equal' => 'O campo :attribute não pode ser uma data futura.',
    'gte' => [
        'numeric' => 'O campo :attribute deve ser maior ou igual a :value.',
    ],
    'in' => 'O valor selecionado para :attribute é inválido.',
    'enum' => 'O valor selecionado para :attribute é inválido.',
    'exists' => 'O valor selecionado para :attribute é inválido.',
    'unique' => 'Este :attribute já está em uso.',
    'regex' => 'O formato do campo :attribute é inválido (use letras minúsculas, números e hífens).',
    'attributes' => [],
];
