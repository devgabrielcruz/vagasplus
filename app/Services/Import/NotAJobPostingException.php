<?php

namespace App\Services\Import;

/** O conteúdo lido não é uma vaga única: não vale a pena cair nas regras simples. */
class NotAJobPostingException extends ImportException {}
