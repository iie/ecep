<?php
namespace App\Models\Infraestructura;
use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
	protected $table = 'infraestructura.sede';
	protected $primaryKey  = 'id_sede';

	public function sala(){
		return $this->belongsTo('App\Models\Infraestructura\Sala', 'id_sala');
	}
}