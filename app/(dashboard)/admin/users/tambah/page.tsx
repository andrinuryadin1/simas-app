"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminTambahPenggunaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "guru",
    phone: "",
    password: "password123",
    status: "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("Nama Lengkap wajib diisi");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email wajib diisi");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }

    setSaving(true);

    try {
      const payload: Record<string, string> = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        password: form.password,
        status: form.status,
      };

      if (form.phone.trim()) {
        payload.phone = form.phone.trim();
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pengguna baru");
      }

      toast.success("Akun pengguna berhasil dibuat!");
      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat membuat pengguna");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/users">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-secondary">Tambah Pengguna Baru</h1>
          <p className="text-muted-foreground mt-1">Isi formulir di bawah untuk mendaftarkan akun baru ke sistem</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data Akun</CardTitle>
          <CardDescription>Informasi profil dan hak akses pengguna</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap <span className="text-destructive">*</span></Label>
                <Input
                  id="fullName"
                  placeholder="Contoh: Ustadz Ahmad Fauzi"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Login <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@kuttabal-fatih.sch.id"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role / Peran <span className="text-destructive">*</span></Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => setForm({ ...form, role: val })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guru">Guru (Ustadz / Ustadzah)</SelectItem>
                    <SelectItem value="manajemen">Manajemen (Pimpinan / Kepala)</SelectItem>
                    <SelectItem value="admin">Administrator (Pengelola Sistem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon / WhatsApp</Label>
                <Input
                  id="phone"
                  placeholder="081234567890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password Awal <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Default: <code className="bg-muted px-1 py-0.5 rounded">password123</code></p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Akun</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm({ ...form, status: val })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif (Bisa Langsung Login)</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Buat Akun"
                )}
              </Button>
              <Link href="/admin/users">
                <Button type="button" variant="outline" disabled={saving}>
                  Batal
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-emerald-200 bg-emerald-50/60">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-emerald-900 leading-relaxed">
              <p className="font-semibold text-sm">Informasi Pembuatan Akun:</p>
              <p>• Akun yang dibuat akan langsung aktif dan dapat digunakan untuk masuk ke SiMas.</p>
              <p>• Berikan alamat email dan password awal di atas kepada pengguna yang bersangkutan.</p>
              <p>• Pengguna dapat memperbarui profil dan mengganti password mereka secara mandiri melalui menu <strong>Profil</strong> setelah login.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
