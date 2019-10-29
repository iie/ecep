<?php
namespace App\Models\Infraestructura;
use Illuminate\Database\Eloquent\Model;

class Institucion extends Model
{
	protected $table = 'infraestructura.institucion';
	protected $primaryKey  = 'id_institucion';

	public function institucion(){
		$this->hasMany('App\Models\Infraestructura\Sede');
	}
}