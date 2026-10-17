<?php

return [

    // Publicação de vagas por visitantes (formulário público + fila de aprovação). Desligada por enquanto:
    // a ideia é voltar a ela junto com os planos. O painel administrativo continua funcionando.
    'job_submissions' => (bool) env('FEATURE_JOB_SUBMISSIONS', false),

];
