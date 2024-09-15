<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class DashboardController extends Controller
{
    public function index()
    {
        $data['web'] = ['title' => 'Dashboard'];
        return view('index', $data);
    }

    public function getBarang()
    {
        $data = Barang::select(['id','nama_barang','harga_barang']);
        return DataTables::of($data)
        ->make(true);
    }
    
    public function postBarang(Request $request)
    {
        $messages = [
            'nama_barang.required' => 'nama barang wajib diisi',
            'harga_barang.required' => 'harga barang wajib diisi'
        ];
        $request->validate([
            'nama_barang' => 'required',
            'harga_barang' => 'required'
        ], $messages);
        $data = $request->all();
        try {
            DB::beginTransaction();
            Barang::create($data);
            DB::commit();
            $response['status'] = 'success';
            $response['message'] = 'Sukses menambahkan data barang';
        } catch (\Throwable $th) {
            DB::rollBack();
            $response['status'] = 'error';
            $response['message'] = 'Gagal menambahkan data barang';
            $response['error'] = $th->getMessage();
        }
        return response()->json($response);
    }
}
