<?php
namespace App\Models\RRHH;
use Illuminate\Database\Eloquent\Model;

class PersonaArchivo extends Model
{
	protected $table = 'rrhh.persona_archivo';
	protected $primaryKey  = 'id_persona_archivo';

	public function persona(){
        return $this->belongsTo(\App\Models\Persona::class);
    }
}