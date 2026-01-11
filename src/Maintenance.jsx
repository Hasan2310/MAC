import { useEffect } from "react";
import Swal from "sweetalert2";

const Maintenance = () => {
//   useEffect(() => {
//     if (sessionStorage.getItem("maintenanceShown")) return;
//     sessionStorage.setItem("maintenanceShown", "true");

//     Swal.fire({
//       icon: "info",
//       title: "Maintenance Notice",
//       html: `
//         <p style="margin-top:8px">
//           Saat ini sistem sedang dalam proses pemeliharaan.<br/>
//           Beberapa fitur mungkin tidak tersedia untuk sementara waktu.
//         </p>
//       `,
//       background: "#ffffff",
//       color: "#233975",
//       confirmButtonText: "Mengerti",
//       confirmButtonColor: "#223B7D",
//       allowOutsideClick: false,
//       allowEscapeKey: false,
//     });
//   }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-[#233975] mb-4">
        Website Sedang Dalam Pemeliharaan
      </h1>

      <p className="text-gray-600 max-w-md">
        Kami sedang melakukan peningkatan sistem untuk memberikan layanan
        yang lebih baik. Silakan kembali beberapa saat lagi.
      </p>

      <div className="mt-10 text-sm text-gray-400">
        Terima kasih atas pengertiannya.
      </div>
    </div>
  );
};

export default Maintenance;
