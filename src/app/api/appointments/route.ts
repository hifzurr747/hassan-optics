import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, appointmentDate, timeSlot, preferredBranch, notes } = body;

    if (!customerName || !phone || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { error: "Missing required appointment fields" },
        { status: 400 }
      );
    }

    const count = await prisma.eyeTestAppointment.count();
    const appointmentRef = `ETA-${801 + count}`;

    const appointment = await prisma.eyeTestAppointment.create({
      data: {
        appointmentRef,
        customerName,
        phone,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        preferredBranch: preferredBranch || "Faisal Plaza, Gulburg Chowk, Mianwali",
        status: "PENDING",
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      appointmentRef: appointment.appointmentRef,
      customerName: appointment.customerName,
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
    });
  } catch (error: any) {
    console.error("Appointment creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to schedule appointment" },
      { status: 500 }
    );
  }
}
