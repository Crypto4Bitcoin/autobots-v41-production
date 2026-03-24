export function legacyDisabledResponse(routeName: string) {
  return Response.json(
    {
      ok: false,
      legacy: true,
      route: routeName,
      message: `${routeName} is temporarily disabled during migration.`,
    },
    { status: 501 }
  );
}