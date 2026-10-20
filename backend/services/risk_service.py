import datetime
from typing import Dict, Any, List, Optional

class RiskScorerService:
    def __init__(self):
        # Configurable prototype scoring weights (sum = 100)
        self.max_visual = 30
        self.max_corroboration = 25
        self.max_rainfall = 20
        self.max_freshness = 15
        self.max_quality = 10

    def compute_risk(
        self,
        has_photo: bool,
        ai_confidence: Optional[float],
        corroborating_count: int,
        rainfall_mm: float,
        rain_probability_pct: float,
        created_at: datetime.datetime,
        has_coordinates: bool,
        has_description: bool,
        verification_status: str = "unverified"
    ) -> Dict[str, Any]:
        """
        Computes transparent evidence score (0-100) based on observable factors.
        Returns detailed score breakdown, contributing factors, and missing information.
        """
        factors = []
        missing_data = []

        # 1. Visual Evidence (0-30 points)
        visual_score = 0
        if has_photo and ai_confidence is not None:
            # Score proportional to model confidence
            visual_score = int(round(self.max_visual * min(max(ai_confidence, 0.0), 1.0)))
            factors.append(f"Visual evidence verified via photo analysis (+{visual_score}/{self.max_visual} pts, {int(ai_confidence*100)}% model confidence)")
        elif has_photo:
            visual_score = 15
            factors.append(f"Photo submitted without visual machine extraction (+{visual_score}/{self.max_visual} pts)")
            missing_data.append("Machine vision feature extraction pending")
        else:
            missing_data.append("No visual photograph submitted with report (0/30 pts)")

        # 2. Corroborating Reports (0-25 points)
        corroboration_score = 0
        if corroborating_count >= 3:
            corroboration_score = self.max_corroboration
            factors.append(f"Multiple independent community reports ({corroborating_count} reports, +{corroboration_score}/{self.max_corroboration} pts)")
        elif corroborating_count == 2:
            corroboration_score = 18
            factors.append(f"Two corroborating nearby reports (+{corroboration_score}/{self.max_corroboration} pts)")
        elif corroborating_count == 1:
            corroboration_score = 10
            factors.append(f"One corroborating nearby report (+{corroboration_score}/{self.max_corroboration} pts)")
        else:
            corroboration_score = 0
            missing_data.append("Single isolated report without corroborating nearby reports")

        # 3. Rainfall & Meteorological Context (0-20 points)
        rainfall_score = 0
        if rainfall_mm > 15.0 or rain_probability_pct > 80:
            rainfall_score = self.max_rainfall
            factors.append(f"Heavy rain conditions recorded ({rainfall_mm}mm, {rain_probability_pct}% precip prob, +{rainfall_score}/{self.max_rainfall} pts)")
        elif rainfall_mm > 5.0 or rain_probability_pct > 50:
            rainfall_score = 14
            factors.append(f"Moderate precipitation detected (+{rainfall_score}/{self.max_rainfall} pts)")
        elif rainfall_mm > 0.5 or rain_probability_pct > 25:
            rainfall_score = 8
            factors.append(f"Light precipitation or overcast rain risk (+{rainfall_score}/{self.max_rainfall} pts)")
        else:
            rainfall_score = 2
            missing_data.append("Low current precipitation in immediate atmospheric reading")

        # 4. Report Freshness (0-15 points)
        freshness_score = 0
        now = datetime.datetime.utcnow()
        age_hours = (now - created_at).total_seconds() / 3600.0

        if age_hours <= 1.0:
            freshness_score = self.max_freshness
            factors.append(f"Fresh report submitted within the last hour (+{freshness_score}/{self.max_freshness} pts)")
        elif age_hours <= 3.0:
            freshness_score = 11
            factors.append(f"Report is 1–3 hours old (+{freshness_score}/{self.max_freshness} pts)")
        elif age_hours <= 6.0:
            freshness_score = 7
            factors.append(f"Report is 3–6 hours old (+{freshness_score}/{self.max_freshness} pts)")
        elif age_hours <= 24.0:
            freshness_score = 3
            factors.append(f"Report is 6–24 hours old (+{freshness_score}/{self.max_freshness} pts)")
        else:
            freshness_score = 0
            missing_data.append("Report is older than 24 hours (potentially stale conditions)")

        # 5. Location and Source Quality (0-10 points)
        quality_score = 0
        if has_coordinates and has_description:
            quality_score = self.max_quality
            factors.append(f"High-fidelity GPS coordinates and descriptive context (+{quality_score}/{self.max_quality} pts)")
        elif has_coordinates:
            quality_score = 6
            factors.append(f"GPS pin provided without detailed narrative (+{quality_score}/{self.max_quality} pts)")
            missing_data.append("Lacks detailed contextual narrative")
        else:
            quality_score = 2
            missing_data.append("Approximate or low-precision location data")

        # Admin Verification Adjustment (status boost/adjustment)
        if verification_status == "verified":
            factors.append("Human civic official verified report (+5 pts verification confidence)")
            visual_score = min(visual_score + 5, self.max_visual)
        elif verification_status == "resolved":
            return {
                "score": 5,
                "level": "Resolved / Cleared",
                "breakdown": {
                    "visual": 0,
                    "corroboration": 0,
                    "rainfall": rainfall_score,
                    "freshness": 0,
                    "location_quality": quality_score
                },
                "factors": ["Incident officially marked as resolved/cleared by civic administration."],
                "missing_data": []
            }

        total_score = visual_score + corroboration_score + rainfall_score + freshness_score + quality_score
        total_score = min(max(total_score, 0), 100)

        # Categorize into suggested display bands
        if total_score >= 60:
            level = "Elevated concern"
        elif total_score >= 30:
            level = "Use caution"
        else:
            level = "Limited evidence"

        return {
            "score": total_score,
            "level": level,
            "breakdown": {
                "visual": visual_score,
                "corroboration": corroboration_score,
                "rainfall": rainfall_score,
                "freshness": freshness_score,
                "location_quality": quality_score
            },
            "weights": {
                "max_visual": self.max_visual,
                "max_corroboration": self.max_corroboration,
                "max_rainfall": self.max_rainfall,
                "max_freshness": self.max_freshness,
                "max_quality": self.max_quality
            },
            "factors": factors,
            "missing_data": missing_data
        }

risk_service = RiskScorerService()
