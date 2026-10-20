import math
import datetime
from typing import List, Tuple

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in meters."""
    R = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def compute_text_similarity(text1: str, text2: str) -> float:
    """Computes basic word-set Jaccard overlap similarity."""
    w1 = set(text1.lower().split())
    w2 = set(text2.lower().split())
    if not w1 or not w2:
        return 0.0
    intersection = w1.intersection(w2)
    union = w1.union(w2)
    return float(len(intersection)) / float(len(union))

class DuplicateDetector:
    def __init__(self, distance_threshold_meters: float = 600.0, time_window_hours: float = 8.0):
        self.distance_threshold = distance_threshold_meters
        self.time_window_hours = time_window_hours

    def find_potential_duplicates(self, target_report, all_reports) -> List[Tuple[str, float, float]]:
        """
        Finds reports that match spatial (<600m), temporal (<8h), and semantic criteria.
        Returns list of (report_id, distance_meters, text_sim).
        """
        candidates = []
        target_time = target_report.created_at

        for r in all_reports:
            if r.id == target_report.id:
                continue

            dist = haversine_distance_meters(
                target_report.latitude, target_report.longitude,
                r.latitude, r.longitude
            )

            time_diff = abs((target_time - r.created_at).total_seconds()) / 3600.0

            if dist <= self.distance_threshold and time_diff <= self.time_window_hours:
                sim = compute_text_similarity(target_report.description or "", r.description or "")
                # If hazard types match or distance is very close (<250m)
                if r.hazard_type.lower() == target_report.hazard_type.lower() or dist < 250:
                    candidates.append((r.id, round(dist, 1), round(sim, 2)))

        return candidates

duplicate_service = DuplicateDetector()
