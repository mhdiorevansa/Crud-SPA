<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    use HasFactory;

    protected $table = 'barang';
    protected $fillable = ['nama_barang', 'harga_barang'];
    public function getHargaBarangAttribute($value)
    {
        return 'Rp ' . number_format($value, 0, ',', '.');
    }
}
