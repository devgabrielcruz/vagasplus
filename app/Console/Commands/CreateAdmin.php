<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdmin extends Command
{
    protected $signature = 'admin:create {email?} {--name=} {--password=}';

    protected $description = 'Cria (ou promove) um usuário administrador';

    public function handle(): int
    {
        $email = $this->argument('email') ?? $this->ask('E-mail');
        $name = $this->option('name') ?? $this->ask('Nome', 'Administrador');
        $password = $this->option('password') ?? $this->secret('Senha (mínimo 12 caracteres)');

        $validator = Validator::make(
            compact('email', 'name', 'password'),
            ['email' => 'required|email', 'name' => 'required|string|max:120', 'password' => 'required|string|min:12'],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::firstOrNew(['email' => $email]);
        $user->name = $name;
        $user->password = $password;
        $user->is_admin = true;
        $user->save();

        $this->info("Administrador {$email} pronto para uso em /admin/login.");

        return self::SUCCESS;
    }
}
