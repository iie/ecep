<?php
namespace App\Http\Controllers\Api\ecep;


use Maatwebsite\Excel\Concerns\FromArray;

class ExcelExport implements FromArray
{
    protected $excel;

    public function __construct(array $excel)
    {
        $this->excel = $excel;
    }

    public function array(): array
    {
        return $this->excel;
    }
}
?>