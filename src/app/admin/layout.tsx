import AdminClientLayout from './client-layout';

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}