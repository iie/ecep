<?php
namespace App\Models\Infraestructura;
use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
	protected $table = 'infraestructura.sala';
	protected $primaryKey  = 'id_sala';

	public function sede(){
		$this->hasMany('App\Models\Infraestructura\Sede');
	}
}