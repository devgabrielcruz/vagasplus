<?php

namespace App\Console\Commands;

use App\Services\JobLifecycle;
use Illuminate\Console\Command;

class PublishScheduledJobs extends Command
{
    protected $signature = 'jobs:publish-scheduled';

    protected $description = 'Publica as vagas agendadas cujo horário já chegou (idempotente)';

    public function handle(JobLifecycle $lifecycle): int
    {
        $count = $lifecycle->publishDue();

        $this->info("{$count} vaga(s) publicada(s).");

        return self::SUCCESS;
    }
}
