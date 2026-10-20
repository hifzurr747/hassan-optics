import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { appointmentId, status, notes } = await request.json();

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Appointment ID and Status are required" },
        { status: 400 }
      );
    }

    const found = await prisma.eyeTestAppointment.findFirst({
      where: {
        OR: [{ id: appointmentId }, { appointmentRef: appointmentId }],
      },
    });

    if (!found) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.eyeTestAppointment.update({
      where: { id: found.id },
      data: {
        status,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    console.error("Failed to update appointment status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update appointment status" },
      { status: 500 }
    );
  }
}
