import datetime
import hashlib
from sqlalchemy.orm import Session
from models import User, Report, AuditLog

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode("utf-8")).hexdigest()

def seed_database(db: Session):
    # Check if admin already exists
    if db.query(User).filter(User.email == "admin@sahaay.org").first():
        return

    # 1. Create Default Users
    admin_user = User(
        id="usr-admin-01",
        email="admin@sahaay.org",
        hashed_password=hash_pw("admin123"),
        full_name="Civic Disaster Response Admin",
        role="admin"
    )

    commuter_user = User(
        id="usr-commuter-01",
        email="commuter@sahaay.org",
        hashed_password=hash_pw("commuter123"),
        full_name="Rajesh Varma",
        role="user"
    )

    db.add(admin_user)
    db.add(commuter_user)
    db.commit()

    # Curated Seed Incidents (Clearly labelled is_demo_data=True)
    now = datetime.datetime.utcnow()
    
    reports = [
        Report(
            id="SHY-HYD-001",
            user_id="usr-commuter-01",
            hazard_type="Waterlogging",
            title="Severe Waterlogging at Begumpet Underpass",
            description="Deep stagnant rainwater accumulating under the bridge. Two-wheelers stalled and vehicle clearance is under 1.5 feet.",
            latitude=17.4448,
            longitude=78.4682,
            address="Begumpet Railway Station Underpass, Hyderabad, Telangana",
            photo_url="/uploads/demo_begumpet_waterlogging.jpg",
            observed_severity="high",
            is_anonymous=False,
            status="verified",
            duplicate_group_id=None,
            ai_analysis={
                "status": "completed",
                "model_name": "Sahaay-CV-EdgeNet-v1 (Pretrained Feature Extractor)",
                "confidence": 0.88,
                "predicted_labels": ["standing_water_surface", "continuous_water_sheet", "turbid_runoff_or_silt"],
                "interpretation": "Possible standing water detected across street surface with high specular reflectance and turbid runoff signatures. Visual evidence alone cannot determine sub-surface roadbed stability.",
                "limitations": "Street-level camera perspective; does not measure sub-surface pothole depth.",
                "human_reviewed": True,
                "image_metrics": {"resolution": "1280x720", "specular_reflectance_ratio": 0.14, "turbidity_indicator": 0.22, "surface_uniformity": "high"}
            },
            weather_context={
                "precipitation_mm": 18.5,
                "temperature_c": 25.2,
                "wind_speed_kmh": 14.0,
                "weather_code": 65,
                "rain_probability_pct": 90,
                "expected_rain_next_6h_mm": 24.0,
                "observation_timestamp": (now - datetime.timedelta(minutes=35)).isoformat(),
                "source": "Open-Meteo API",
                "data_status": "live",
                "context_note": "Heavy active rainfall recorded in Begumpet weather cell."
            },
            risk_score=85,
            risk_level="Elevated concern",
            risk_breakdown={
                "visual": 26,
                "corroboration": 22,
                "rainfall": 19,
                "freshness": 15,
                "location_quality": 10,
                "factors": [
                    "Visual evidence confirmed water pooling (+26/30 pts, 88% confidence)",
                    "3 corroborating community reports in 500m radius (+22/25 pts)",
                    "Heavy rainfall active (18.5mm, 90% precip prob, +19/20 pts)",
                    "Fresh report submitted within 45 minutes (+15/15 pts)",
                    "High-precision GPS coordinates verified (+10/10 pts)"
                ],
                "missing_data": []
            },
            review_notes="Verified by Hyderabad Civic Disaster Response team. Traffic police barricade placed on south ramp.",
            reviewer_id="admin@sahaay.org",
            flags_count=0,
            is_demo_data=True,
            created_at=now - datetime.timedelta(minutes=45),
            updated_at=now - datetime.timedelta(minutes=20)
        ),
        Report(
            id="SHY-HYD-002",
            user_id=None,
            hazard_type="Flooded Road",
            title="Drain Overflow near Tolichowki Flyover Pillar 24",
            description="Stormwater drain overflowing onto main service road towards Mehdipatnam. High flow velocity near curb.",
            latitude=17.4011,
            longitude=78.4116,
            address="Pillar 24, Tolichowki Main Road, Hyderabad, Telangana",
            photo_url="/uploads/demo_tolichowki_flood.jpg",
            observed_severity="high",
            is_anonymous=True,
            status="corroborated",
            duplicate_group_id=None,
            ai_analysis={
                "status": "completed",
                "model_name": "Sahaay-CV-EdgeNet-v1 (Pretrained Feature Extractor)",
                "confidence": 0.81,
                "predicted_labels": ["standing_water_surface", "patchy_surface_puddles"],
                "interpretation": "Surface water sheet detected near curb barrier with visible road spray and reflections.",
                "limitations": "Raindrop interference on lens; exact water depth unverified.",
                "human_reviewed": False,
                "image_metrics": {"resolution": "1080x1920", "specular_reflectance_ratio": 0.09, "turbidity_indicator": 0.18, "surface_uniformity": "moderate"}
            },
            weather_context={
                "precipitation_mm": 12.0,
                "temperature_c": 26.0,
                "wind_speed_kmh": 11.0,
                "weather_code": 63,
                "rain_probability_pct": 75,
                "expected_rain_next_6h_mm": 15.0,
                "observation_timestamp": (now - datetime.timedelta(hours=1, minutes=10)).isoformat(),
                "source": "Open-Meteo API",
                "data_status": "live",
                "context_note": "Moderate to heavy rain recorded."
            },
            risk_score=72,
            risk_level="Elevated concern",
            risk_breakdown={
                "visual": 24,
                "corroboration": 16,
                "rainfall": 15,
                "freshness": 12,
                "location_quality": 9,
                "factors": [
                    "Surface water sheet visible (+24/30 pts)",
                    "Two nearby corroborating motorist reports (+16/25 pts)",
                    "Active rain over 12mm (+15/20 pts)",
                    "Report age 70 minutes (+12/15 pts)",
                    "Valid GPS pin (+9/10 pts)"
                ],
                "missing_data": ["Municipal field officer confirmation pending"]
            },
            review_notes="Automated corroboration clustering matched 2 community reports.",
            reviewer_id=None,
            flags_count=0,
            is_demo_data=True,
            created_at=now - datetime.timedelta(hours=1, minutes=10),
            updated_at=now - datetime.timedelta(hours=1, minutes=5)
        ),
        Report(
            id="SHY-HYD-003",
            user_id="usr-commuter-01",
            hazard_type="Road Obstruction",
            title="Fallen Tree Branch on Cyber Towers Junction Ramp",
            description="Large bough broken from median tree obstructing leftmost lane. Causes sudden bottleneck.",
            latitude=17.4504,
            longitude=78.3808,
            address="Cyber Towers Signal, Hitec City, Hyderabad, Telangana",
            photo_url="/uploads/demo_obstruction.jpg",
            observed_severity="medium",
            is_anonymous=False,
            status="unverified",
            duplicate_group_id=None,
            ai_analysis={
                "status": "completed",
                "model_name": "Sahaay-CV-EdgeNet-v1 (Pretrained Feature Extractor)",
                "confidence": 0.79,
                "predicted_labels": ["roadway_impediment", "reduced_carriageway_clearance"],
                "interpretation": "Vegetation / obstacle detected partially blocking right-of-way carriageway.",
                "limitations": "Model cannot assess clearance height or trunk weight.",
                "human_reviewed": False,
                "image_metrics": {"resolution": "1920x1080", "specular_reflectance_ratio": 0.02, "turbidity_indicator": 0.04, "surface_uniformity": "moderate"}
            },
            weather_context={
                "precipitation_mm": 2.2,
                "temperature_c": 27.1,
                "wind_speed_kmh": 22.0,
                "weather_code": 3,
                "rain_probability_pct": 40,
                "expected_rain_next_6h_mm": 3.0,
                "observation_timestamp": (now - datetime.timedelta(hours=2)).isoformat(),
                "source": "Open-Meteo API",
                "data_status": "live",
                "context_note": "High gust wind recorded (22 km/h)."
            },
            risk_score=48,
            risk_level="Use caution",
            risk_breakdown={
                "visual": 21,
                "corroboration": 0,
                "rainfall": 6,
                "freshness": 11,
                "location_quality": 10,
                "factors": [
                    "Obstacle identified on carriageway (+21/30 pts)",
                    "Fresh report submitted 2 hours ago (+11/15 pts)",
                    "High wind speeds in area (+6/20 pts)"
                ],
                "missing_data": ["No secondary corroborating report yet (single observer)", "No flood or standing water"]
            },
            review_notes="Disaster Response Force (DRF) tree cutting van notified.",
            reviewer_id=None,
            flags_count=0,
            is_demo_data=True,
            created_at=now - datetime.timedelta(hours=2),
            updated_at=now - datetime.timedelta(hours=2)
        ),
        Report(
            id="SHY-HYD-004",
            user_id=None,
            hazard_type="Damaged Road",
            title="Submerged Pothole Cluster near Somajiguda Circle",
            description="Series of 3 deep potholes hidden under muddy rainwater sheen. Several auto rickshaws losing balance.",
            latitude=17.4262,
            longitude=78.4578,
            address="Somajiguda Main Road, Hyderabad, Telangana",
            photo_url="/uploads/demo_pothole.jpg",
            observed_severity="medium",
            is_anonymous=True,
            status="unverified",
            duplicate_group_id=None,
            ai_analysis={
                "status": "completed",
                "model_name": "Sahaay-CV-EdgeNet-v1 (Pretrained Feature Extractor)",
                "confidence": 0.76,
                "predicted_labels": ["irregular_surface_texture", "pavement_fracture_risk", "damp_asphalt_sheen"],
                "interpretation": "Compromised road surface texture and wet hollows detected.",
                "limitations": "Surface water masks physical crater depth.",
                "human_reviewed": False,
                "image_metrics": {"resolution": "1280x720", "specular_reflectance_ratio": 0.05, "turbidity_indicator": 0.12, "surface_uniformity": "moderate"}
            },
            weather_context={
                "precipitation_mm": 4.1,
                "temperature_c": 26.5,
                "wind_speed_kmh": 9.0,
                "weather_code": 61,
                "rain_probability_pct": 55,
                "expected_rain_next_6h_mm": 6.5,
                "observation_timestamp": (now - datetime.timedelta(hours=3, minutes=15)).isoformat(),
                "source": "Open-Meteo API",
                "data_status": "live",
                "context_note": "Intermittent light rain."
            },
            risk_score=54,
            risk_level="Use caution",
            risk_breakdown={
                "visual": 20,
                "corroboration": 8,
                "rainfall": 9,
                "freshness": 8,
                "location_quality": 9,
                "factors": [
                    "Surface fracture and puddle sheen detected (+20/30 pts)",
                    "1 nearby corroborating report (+8/25 pts)",
                    "Report age 3.2 hours (+8/15 pts)"
                ],
                "missing_data": ["Visual alone cannot measure exact cavity depth"]
            },
            review_notes=None,
            reviewer_id=None,
            flags_count=0,
            is_demo_data=True,
            created_at=now - datetime.timedelta(hours=3, minutes=15),
            updated_at=now - datetime.timedelta(hours=3, minutes=15)
        ),
        Report(
            id="SHY-HYD-005",
            user_id="usr-commuter-01",
            hazard_type="Waterlogging",
            title="Panjagutta Junction Cleared - Water Drained",
            description="Municipal suction pumps deployed. Road surface is damp but fully passable for all traffic.",
            latitude=17.4277,
            longitude=78.4485,
            address="Panjagutta Central Junction, Hyderabad, Telangana",
            photo_url="/uploads/demo_cleared.jpg",
            observed_severity="low",
            is_anonymous=False,
            status="resolved",
            duplicate_group_id=None,
            ai_analysis={
                "status": "completed",
                "model_name": "Sahaay-CV-EdgeNet-v1 (Pretrained Feature Extractor)",
                "confidence": 0.85,
                "predicted_labels": ["damp_asphalt_sheen"],
                "interpretation": "Damp road surface visible without continuous standing water or blockage.",
                "limitations": "Surface remains damp; braking distance may increase slightly.",
                "human_reviewed": True,
                "image_metrics": {"resolution": "1280x720", "specular_reflectance_ratio": 0.03, "turbidity_indicator": 0.02, "surface_uniformity": "moderate"}
            },
            weather_context={
                "precipitation_mm": 0.0,
                "temperature_c": 27.8,
                "wind_speed_kmh": 7.0,
                "weather_code": 2,
                "rain_probability_pct": 15,
                "expected_rain_next_6h_mm": 0.5,
                "observation_timestamp": (now - datetime.timedelta(hours=5)).isoformat(),
                "source": "Open-Meteo API",
                "data_status": "live",
                "context_note": "Rain stopped in Panjagutta area."
            },
            risk_score=5,
            risk_level="Resolved / Cleared",
            risk_breakdown={
                "visual": 0,
                "corroboration": 0,
                "rainfall": 1,
                "freshness": 0,
                "location_quality": 4,
                "factors": ["Water pumped out by municipal authority. Normal traffic flow restored."],
                "missing_data": []
            },
            review_notes="Marked resolved after GHMC municipal pump team verified drainage clearance.",
            reviewer_id="admin@sahaay.org",
            flags_count=0,
            is_demo_data=True,
            created_at=now - datetime.timedelta(hours=6),
            updated_at=now - datetime.timedelta(hours=1)
        ),
        Report(
            id="SHY-HYD-006",
            user_id=None,
            hazard_type="Waterlogging",
            title="Mehdipatnam Bus Depot Stagnant Water (Old Report)",
            description="Water pooled by curb from previous rainstorm 2 days ago.",
            latitude=17.3916,
            longitude=78.4387,
            address="Mehdipatnam Bus Depot, Hyderabad, Telangana",
            photo_url="/uploads/demo_mehdipatnam_stale.jpg",
            observed_severity="low",
            is_anonymous=True,
            status="stale",
            duplicate_group_id=None,
            ai_analysis={
                "status": "completed",
                "model_name": "Sahaay-CV-EdgeNet-v1 (Pretrained Feature Extractor)",
                "confidence": 0.70,
                "predicted_labels": ["patchy_surface_puddles"],
                "interpretation": "Localized puddles observed.",
                "limitations": "Older submission; surface conditions likely shifted.",
                "human_reviewed": False,
                "image_metrics": {"resolution": "1080x720", "specular_reflectance_ratio": 0.04, "turbidity_indicator": 0.05, "surface_uniformity": "moderate"}
            },
            weather_context={
                "precipitation_mm": 0.0,
                "temperature_c": 30.1,
                "wind_speed_kmh": 6.0,
                "weather_code": 1,
                "rain_probability_pct": 10,
                "expected_rain_next_6h_mm": 0.0,
                "observation_timestamp": (now - datetime.timedelta(hours=36)).isoformat(),
                "source": "Open-Meteo API",
                "data_status": "live",
                "context_note": "Dry weather for 24h+."
            },
            risk_score=14,
            risk_level="Limited evidence",
            risk_breakdown={
                "visual": 8,
                "corroboration": 0,
                "rainfall": 1,
                "freshness": 0,
                "location_quality": 5,
                "factors": ["Historical report (submitted > 36 hours ago). Conditions likely altered."],
                "missing_data": ["Report is stale and has not been reaffirmed by recent commuters."]
            },
            review_notes="Auto-transitioned to stale due to age exceeding 24 hours without new corroborations.",
            reviewer_id="admin@sahaay.org",
            flags_count=0,
            is_demo_data=True,
            created_at=now - datetime.timedelta(hours=38),
            updated_at=now - datetime.timedelta(hours=14)
        )
    ]

    for r in reports:
        db.add(r)

    # Add initial audit log
    audit = AuditLog(
        incident_id="SHY-HYD-001",
        user_email="admin@sahaay.org",
        action="verified",
        details="Civic inspector validated waterlogging at Begumpet underpass with drone & patrol vehicle."
    )
    db.add(audit)

    audit_resolved = AuditLog(
        incident_id="SHY-HYD-005",
        user_email="admin@sahaay.org",
        action="resolved",
        details="GHMC water suction truck completed clearance. Flow restored."
    )
    db.add(audit_resolved)

    db.commit()

