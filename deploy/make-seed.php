<?php

/*
 * Gera deploy/seed/database.sqlite: uma cópia do banco local SEM dados pessoais ou segredos,
 * usada para popular o site de teste na primeira inicialização.
 *
 * Uso (na raiz do projeto):  php deploy/make-seed.php
 *
 * Removidos: usuários (o admin é criado por ADMIN_EMAIL/ADMIN_PASSWORD), sessões, cache, filas,
 * tokens de senha, envios de vaga (contêm e-mail de quem enviou) e a chave do Gemini
 * (ela é criptografada com o APP_KEY local; no servidor use a variável GEMINI_API_KEY).
 */

$source = __DIR__.'/../database/database.sqlite';
$target = __DIR__.'/seed/database.sqlite';

if (! is_file($source)) {
    fwrite(STDERR, "Banco local não encontrado em database/database.sqlite\n");
    exit(1);
}

@mkdir(dirname($target), 0777, true);
copy($source, $target);

$db = new PDO('sqlite:'.$target);
$db->exec('PRAGMA foreign_keys = OFF');

foreach (['sessions', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens', 'users', 'job_submissions'] as $table) {
    $db->exec("DELETE FROM \"{$table}\"");
}
$db->exec("DELETE FROM settings WHERE key = 'gemini_api_key'");
$db->exec('VACUUM');

foreach (['users', 'job_submissions', 'job_postings', 'companies', 'categories', 'settings'] as $table) {
    echo str_pad($table, 18).$db->query("SELECT COUNT(*) FROM \"{$table}\"")->fetchColumn()."\n";
}
echo "\nGerado: deploy/seed/database.sqlite\n";
