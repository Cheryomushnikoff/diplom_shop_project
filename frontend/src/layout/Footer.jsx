export default function Footer() {
  return (<>
    <hr className="my-4" />

      <div className="text-center text-muted small mb-5">
        © {new Date().getFullYear()} Магазин • Все права защищены
      </div>
      </>
  );
}
