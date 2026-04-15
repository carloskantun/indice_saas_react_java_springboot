export interface AttendancePunchSnapshot {
  first_check_in_at?: string | null;
  last_check_out_at?: string | null;
}

export interface AttendancePunchState {
  hasCheckIn: boolean;
  hasCheckOut: boolean;
  hasActiveCheckIn: boolean;
}

export type AttendancePunchAction = 'check_in' | 'check_out' | 'break_out' | 'break_in';

export interface AttendancePunchValidationMessages {
  checkInAlreadyActive: string;
  checkOutRequiresCheckIn: string;
}

export function deriveAttendancePunchState(
  snapshot?: AttendancePunchSnapshot | null,
): AttendancePunchState {
  const hasCheckIn = Boolean(snapshot?.first_check_in_at);
  const hasCheckOut = Boolean(snapshot?.last_check_out_at);

  return {
    hasCheckIn,
    hasCheckOut,
    hasActiveCheckIn: hasCheckIn && !hasCheckOut,
  };
}

export function getAttendancePunchValidationMessage(
  action: AttendancePunchAction,
  punchState: AttendancePunchState,
  messages: AttendancePunchValidationMessages,
): string | null {
  if (action === 'check_in' && punchState.hasActiveCheckIn) {
    return messages.checkInAlreadyActive;
  }

  if (action === 'check_out' && !punchState.hasActiveCheckIn) {
    return messages.checkOutRequiresCheckIn;
  }

  return null;
}
