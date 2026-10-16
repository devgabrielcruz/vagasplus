<?php

namespace App\Console\Commands;

use App\Services\JobLifecycle;
use Illuminate\Console\Command;

class ExpireJobs extends Command
{
    protected $signature = 'jobs:expire';

    protected $description = 'Encerra as vagas cujo prazo de validade terminou (idempotente)';

    public function handle(JobLifecycle $lifecycle): int
    {
        $count = $lifecycle->expireDue();

        $this->info("{$count} vaga(s) expirada(s).");

        return self::SUCCESS;
    }
}
