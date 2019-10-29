<?php
namespace App\Models\RRHH;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
	protected $table = 'rrhh.persona';
	protected $primaryKey  = 'id_persona';

	public function laboratorioVisita(){
		return $this->belongsTo('App\Models\Infraestructura\LaboratorioVisita', 'id_persona');
	}
}