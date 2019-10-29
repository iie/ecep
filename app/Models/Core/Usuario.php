<?php
namespace App\Models\Core;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
	protected $table = 'core.usuario';
	protected $primaryKey  = 'id_usuario';
}