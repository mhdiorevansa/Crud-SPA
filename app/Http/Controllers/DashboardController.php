<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
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
        $data = Barang::select(['id', 'nama_barang', 'harga_barang', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'asc');
        $datatable = DataTables::eloquent($data)
            ->editColumn('id', function ($data) {
                return Crypt::encryptString($data->id);
            })
            ->addIndexColumn()
            ->make(true);
        return $datatable;
    }

    public function postBarang(Request $request)
    {
        $messages = [
            'nama_barang.required' => 'nama barang wajib diisi',
            'harga_barang.required' => 'harga barang wajib diisi',
            'harga_barang.max' => 'harga barang maksimal :max digit'
        ];
        $request->validate([
            'nama_barang' => 'required',
            'harga_barang' => 'required|max:10'
        ], $messages);
        $data = $request->all();
        try {
            DB::beginTransaction();
            Barang::create($data);
            DB::commit();
            $response = [
                'status' => 'success',
                'message' => 'Sukses menambahkan data barang'
            ];
        } catch (\Throwable $th) {
            DB::rollBack();
            $response = [
                'status' => 'error',
                'message' => 'Gagal menambahkan data barang',
                'error' => $th->getMessage(),
            ];
        }
        return response()->json($response);
    }

    public function editBarang($id)
    {
        try {
            $dcryptId = Crypt::decryptString($id);
            $data = Barang::select('nama_barang', 'harga_barang')->where('id', $dcryptId)->firstOrFail();
            $response = [
                'status' => 'success',
                'message' => 'barang loaded successfully',
                'data' => $data
            ];
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }

    public function updateBarang($id, Request $request)
    {
        $messages = [
            'nama_barang.required' => 'nama barang wajib diisi',
            'harga_barang.required' => 'harga barang wajib diisi',
            'harga_barang.max' => 'harga barang maksimal :max digit'
        ];
        $request->validate([
            'nama_barang' => 'required',
            'harga_barang' => 'required|max:10'
        ], $messages);
        try {
            $id = Crypt::decryptString($id);
            $data = Barang::findOrFail($id);
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Data tidak ditemukan'
            ];
        }
        $dataToUpdate = $request->except('id');
        $dataToUpdate['harga_barang'] = str_replace(['.', ','], '', $request->input('harga_barang', 0));
        try {
            DB::beginTransaction();
            $data->update($dataToUpdate);
            DB::commit();
            $response = [
                'status' => 'success',
                'message' => 'Data berhasil di update'
            ];
        } catch (\Throwable $th) {
            DB::rollBack();
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }
}
